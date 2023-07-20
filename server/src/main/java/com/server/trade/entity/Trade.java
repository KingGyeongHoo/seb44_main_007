package com.server.trade.entity;

import com.server.member.entity.Member;
import com.server.total.entity.Total;
import com.server.utils.CustomBeanUtils;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "trade")
public class Trade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long tradeId;
    private String type; //수입 or 지출
    private String tradeName; //내역
    @NotNull
    private BigDecimal amount; //금액정확도를 위해 BigDecimal 타입을 사용했습니다.
    private String note; //비고
    private LocalDate date; //날짜 LocalDate.of(2023, 7, 1);
    @Enumerated(EnumType.STRING)
    private Category category;





    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "memberId", nullable = false)
    private Member member;
    public void setMember(Member member) {
        this.member = member;
        member.getTradeList().add(this);
    }




    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "totalId", nullable = false)
    private Total total;

    public void setTotal(Total total) {
        this.total = total;
        total.getTradeList().add(this);
    }


    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Trade changeTrade(Trade sourceTrade, CustomBeanUtils<Trade> beanUtils) {
        return beanUtils.copyNonNullProperties(sourceTrade, this);
    }


    public BigDecimal getTotalIncome() {
        return total.getTotalIncome();
    }
    public BigDecimal getTotalOutcome() {
        return total.getTotalOutcome();
    }
    public BigDecimal getGoal() {
        return total.getGoal();
    }
}

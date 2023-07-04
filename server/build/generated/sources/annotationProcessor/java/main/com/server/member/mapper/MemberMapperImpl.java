package com.server.member.mapper;

import com.server.member.dto.MemberDto;
import com.server.member.entity.Member;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2023-07-04T13:24:20+0900",
    comments = "version: 1.5.1.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.1.1.jar, environment: Java 19.0.2 (Azul Systems, Inc.)"
)
@Component
public class MemberMapperImpl implements MemberMapper {

    @Override
    public Member memberPostDtoToMember(MemberDto.Post requestBody) {
        if ( requestBody == null ) {
            return null;
        }

        Member member = new Member();

        member.setEmail( requestBody.getEmail() );
        member.setPassword( requestBody.getPassword() );
        member.setName( requestBody.getName() );
        member.setPhoneNumber( requestBody.getPhoneNumber() );

        return member;
    }

    @Override
    public Member memberPutDtoToMember(MemberDto.Put requestBody) {
        if ( requestBody == null ) {
            return null;
        }

        Member member = new Member();

        member.setMemberId( requestBody.getMemberId() );
        member.setName( requestBody.getName() );
        member.setPhoneNumber( requestBody.getPhoneNumber() );

        return member;
    }

    @Override
    public MemberDto.Response memberToMemberResponseDto(Member member) {
        if ( member == null ) {
            return null;
        }

        long memberId = 0L;
        String name = null;
        String email = null;
        Integer phoneNumber = null;
        String createdAt = null;

        memberId = member.getMemberId();
        name = member.getName();
        email = member.getEmail();
        phoneNumber = member.getPhoneNumber();
        if ( member.getCreatedAt() != null ) {
            createdAt = DateTimeFormatter.ISO_LOCAL_DATE_TIME.format( member.getCreatedAt() );
        }

        MemberDto.Response response = new MemberDto.Response( memberId, name, email, phoneNumber, createdAt );

        return response;
    }

    @Override
    public List<MemberDto.Response> membersToMemberResponseDtos(List<Member> members) {
        if ( members == null ) {
            return null;
        }

        List<MemberDto.Response> list = new ArrayList<MemberDto.Response>( members.size() );
        for ( Member member : members ) {
            list.add( memberToMemberResponseDto( member ) );
        }

        return list;
    }
}
